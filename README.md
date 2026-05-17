# The Archive

📂 **assets/**
Dùng để chứa các tài nguyên tĩnh được dùng trong code như: hình ảnh (.png, .jpg), icons (.svg), hoặc các file CSS dùng chung cho toàn dự án.

📂 **components/**
Chứa các thành phần giao diện nhỏ, có thể tái sử dụng nhiều lần.
Ví dụ: `Button.tsx`, `BookCard.tsx`.
Thường được chia thành các folder con: `common/`, `ui/`, `form/`.

📂 **layouts/**
Chứa các thành phần bố cục dùng chung cho nhiều trang.
Ví dụ: `Header.tsx`, `Footer.tsx`, `Layout.tsx`.

📂 **pages/** (hoặc views/)
Chứa các thành phần đại diện cho một "trang" hoàn chỉnh (tương ứng với một đường dẫn URL).
Ví dụ: `Home.tsx`, `Login.tsx`, `Explore.tsx`.
Một Page sẽ được lắp ghép từ nhiều Components.

📂 **services/** (hoặc api/)
Nơi quản lý các hàm gọi API sang Backend của bạn.
Ví dụ: `BookService.ts`, `AuthService.ts`.
Thay vì viết lệnh fetch hay axios trực tiếp trong Component, bạn viết ở đây để dễ quản lý và sửa lỗi.

📂 **hooks/**
Chứa các Custom Hooks do bạn tự viết để xử lý logic lặp đi lặp lại. (Ví dụ: `useAuth`, `useFetch`).

📂 **context/** (hoặc store/)
Nơi quản lý trạng thái toàn cục (Global State) của ứng dụng.
Ví dụ: `AuthContext.tsx` để lưu thông tin người dùng đã đăng nhập, giúp mọi trang đều biết ai đang dùng hệ thống mà không cần truyền props lòng vòng.

📂 **routers/** (hoặc routes/navigation/)
Nơi cấu hình các đường dẫn (URL). Bạn sẽ dùng thư viện `react-router-dom` ở đây để điều hướng người dùng từ trang này sang trang khác.

## Các file quan trọng ở ngoài cùng
- **App.tsx**: Component gốc, nơi bắt đầu lắp ghép các thành phần chính của ứng dụng.
- **main.tsx**: Điểm vào (Entry point) của JavaScript, nơi kết nối code React vào file HTML ở thư mục public.
- **package.json**: File "hộ chiếu" của dự án, ghi danh sách các thư viện đã cài và các câu lệnh chạy script (như `npm run dev`, `npm run build`).
