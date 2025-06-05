# Gym Management System - Test Suite

## Mô tả

Test suite này được thiết kế theo phương pháp **Test-Driven Development (TDD)** sử dụng Jest và Supertest để kiểm thử backend của hệ thống quản lý phòng gym.

## Cấu trúc Tests

```
tests/
├── setup.js                 # Cấu hình Jest và MongoDB Memory Server
├── helpers/
│   ├── testHelpers.js       # Utility functions cho testing
│   └── testApp.js           # Express app instance cho testing
├── unit/
│   └── user.model.test.js   # Unit tests cho models
└── integration/
    ├── auth.test.js         # Integration tests cho authentication
    ├── users.test.js        # Integration tests cho user management
    └── equipment.test.js    # Integration tests cho equipment management
```

## Công nghệ sử dụng

- **Jest**: Test framework chính
- **Supertest**: HTTP testing library
- **MongoDB Memory Server**: In-memory MongoDB cho testing
- **bcryptjs**: Mã hóa password cho test data

## Cài đặt Dependencies

```bash
npm install --save-dev jest supertest @babel/preset-env mongodb-memory-server
```

## Chạy Tests

### Chạy tất cả tests

```bash
npm test
```

### Chạy tests ở watch mode

```bash
npm run test:watch
```

### Chạy tests với coverage report

```bash
npm run test:coverage
```

### Chạy tests cho file cụ thể

```bash
npm test -- auth.test.js
npm test -- users.test.js
npm test -- equipment.test.js
```

## Phương pháp TDD (Test-Driven Development)

### 1. Red-Green-Refactor Cycle

1. **Red**: Viết test trước khi implement feature
2. **Green**: Viết code tối thiểu để test pass
3. **Refactor**: Cải thiện code mà không thay đổi behavior

### 2. Test Structure (AAA Pattern)

Mỗi test case tuân theo cấu trúc AAA:

```javascript
it("should do something", async () => {
  // Arrange - Chuẩn bị dữ liệu test
  const user = await createTestUser({ email: "test@example.com" });

  // Act - Thực hiện hành động cần test
  const response = await request(app).get(`/api/users/${user._id}`);

  // Assert - Kiểm tra kết quả
  expect(response.status).toBe(200);
  expect(response.body.user.email).toBe("test@example.com");
});
```

### 3. Test Categories

#### Unit Tests

- Test từng component riêng lẻ (models, utilities)
- Không phụ thuộc vào external services
- Chạy nhanh và isolated

#### Integration Tests

- Test tương tác giữa các components
- Test API endpoints với database
- Test authentication và authorization

## Test Helpers

### createTestUser()

Tạo user test với các role khác nhau:

```javascript
const member = await createTestMember();
const admin = await createTestAdmin();
const trainer = await createTestTrainer();
const employee = await createTestEmployee();
```

### generateTestToken()

Tạo JWT token cho authentication testing:

```javascript
const token = generateTestToken(user._id, user.role);
```

## Quy tắc viết tests

### 1. Test Names

- Sử dụng mô tả rõ ràng về behavior
- Format: "should [expected behavior] when [condition]"

```javascript
it("should return 401 when token is missing", async () => {
  // test implementation
});
```

### 2. Test Data

- Sử dụng test helpers để tạo data
- Mỗi test phải độc lập
- Cleanup data sau mỗi test (đã cấu hình trong setup.js)

### 3. Assertions

- Test cả positive và negative cases
- Test error handling
- Test edge cases

### 4. Mocking

- Mock external services (email, file upload)
- Sử dụng MongoDB Memory Server cho database

## Coverage Requirements

Mục tiêu coverage:

- **Controllers**: > 90%
- **Models**: > 85%
- **Routes**: > 90%
- **Middleware**: > 85%

## Debugging Tests

### Chạy test với debug mode

```bash
npm test -- --detectOpenHandles --verbose
```

### Log output trong tests

```javascript
console.log("Response:", response.body); // Temporary debugging
```

## Best Practices

1. **Isolation**: Mỗi test phải độc lập
2. **Readability**: Code test phải dễ đọc và hiểu
3. **Maintainability**: Test phải dễ maintain khi code thay đổi
4. **Performance**: Test phải chạy nhanh
5. **Coverage**: Đảm bảo test coverage cao

## Continuous Integration

Tests được tự động chạy khi:

- Push code lên repository
- Tạo Pull Request
- Deploy application

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Đảm bảo MongoDB Memory Server được khởi động
   - Check setup.js configuration

2. **Token Authentication Error**

   - Verify JWT_SECRET trong test environment
   - Check token generation trong helpers

3. **Test Timeout**
   - Tăng timeout trong Jest config
   - Check for async operations not being awaited

### Environment Variables

Tạo file `.env.test` với các biến môi trường cho testing:

```env
NODE_ENV=test
JWT_SECRET=test-jwt-secret
# Các biến khác...
```

## Kết luận

Test suite này cung cấp foundation vững chắc cho việc phát triển backend theo phương pháp TDD. Hãy luôn viết tests trước khi implement features mới để đảm bảo code quality và reliability.
