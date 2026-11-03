import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Không theo dõi file build/database của .NET để tránh lỗi khóa file trên Windows.
  server: { watch: { ignored: ['**/backend/**', '**/.tools/**'] } },
});
