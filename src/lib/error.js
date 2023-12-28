export default class ActionError extends Error {
  constructor(message = "Đã có lỗi xảy ra", code = 500) {
    super(message)
    this.code = code
  }

  toJson() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    }
  }
}

export class Unauthorized extends ActionError {
  constructor(message = "Hành động này yêu cầu đăng nhập", code = 401) {
    super(message, code)
  }
}

export class Forbidden extends ActionError {
  constructor(message = "Không có quyền thực hiện hành động này", code = 403) {
    super(message, code)
  }
}

export class NotFound extends ActionError {
  constructor(message = "Tài nguyên không tồn tại hoặc đã bị xoá", code = 404) {
    super(message, code)
  }
}
