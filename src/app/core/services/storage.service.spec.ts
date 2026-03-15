import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get item from localStorage', () => {
    service.setItem('testKey', 'testValue');
    expect(service.getItem('testKey')).toBe('testValue');
  });

  it('should return null for non-existent key', () => {
    expect(service.getItem('nonExistent')).toBeNull();
  });

  it('should remove item from localStorage', () => {
    service.setItem('testKey', 'testValue');
    service.removeItem('testKey');
    expect(service.getItem('testKey')).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    service.setItem('key1', 'value1');
    service.setItem('key2', 'value2');
    service.clear();
    expect(service.getItem('key1')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });

  it('should handle localStorage errors gracefully', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    expect(() => service.setItem('key', 'value')).not.toThrow();
  });
});
