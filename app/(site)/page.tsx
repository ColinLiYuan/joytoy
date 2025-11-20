// 在页面组件中添加调试信息
export default function Home() {
  return (
      <div>
        <h1>环境变量调试</h1>
        <p>API_URL: {process.env.NEXT_PUBLIC_API_URL || '未设置'}</p>
        <p>API_BASE_URL: {process.env.API_BASE_URL}</p>
        <p>BACKEND_BASE_URL: {process.env.BACKEND_BASE_URL}</p>
      </div>
  )
}