import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('HttpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle HTTP errors', () => {
    httpClient.get('/test').subscribe(
      () => fail('should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(notificationService.error).toHaveBeenCalled();
      }
    );

    const req = httpMock.expectOne('/test');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('should display error message from response', () => {
    httpClient.get('/test').subscribe(
      () => fail('should have failed'),
      () => {
        expect(notificationService.error).toHaveBeenCalledWith('Custom error message');
      }
    );

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Custom error message' }, { status: 400, statusText: 'Bad Request' });
  });
});
