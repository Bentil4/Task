import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(() => {
    const storageServiceMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });

    storageService = TestBed.inject(StorageService) as jest.Mocked<StorageService>;
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    storageService.getItem.mockReturnValue(null);
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('should initialize with stored theme', () => {
    storageService.getItem.mockReturnValue('dark');
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('should set theme and update storage', () => {
    storageService.getItem.mockReturnValue(null);
    service = TestBed.inject(ThemeService);
    
    service.setTheme('dark');
    
    expect(service.theme()).toBe('dark');
    expect(storageService.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle theme from light to dark', () => {
    storageService.getItem.mockReturnValue('light');
    service = TestBed.inject(ThemeService);
    
    service.toggleTheme();
    
    expect(service.theme()).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    storageService.getItem.mockReturnValue('dark');
    service = TestBed.inject(ThemeService);
    
    service.toggleTheme();
    
    expect(service.theme()).toBe('light');
  });
});
