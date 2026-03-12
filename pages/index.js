export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛡️ Sentinel Monitor</h1>
      <p>Your monitoring system is running on Vercel!</p>
      <p>Checks run every 5 minutes automatically.</p>
      <p>Status: Ready for deployment</p>
      <p>
        <a href="/api/monitor" target="_blank">
          Test monitor endpoint
        </a>
      </p>
    </div>
  );
}