import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    const notificationServiceMock = {
      error: jest.fn(),
      success: jest.fn(),
      show: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show error notification on HTTP error', (done) => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed'),
      error: (error: HttpErrorResponse) => {
        expect(notificationService.error).toHaveBeenCalled();
        expect(error.status).toBe(500);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should use error message from response', (done) => {
    const testUrl = '/api/test';
    const errorMessage = 'Custom error message';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed'),
      error: () => {
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 errors', (done) => {
    const testUrl = '/api/notfound';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(notificationService.error).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should not intercept successful requests', () => {
    const testUrl = '/api/success';
    const testData = { data: 'test' };

    httpClient.get(testUrl).subscribe(data => {
      expect(data).toEqual(testData);
      expect(notificationService.error).not.toHaveBeenCalled();
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(testData);
  });
});
