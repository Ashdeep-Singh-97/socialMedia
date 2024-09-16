// app/guest/home/layout.tsx
import Layout from '../components/Layout';

export default function GuestHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout isLoggedIn={false}>
      {children}
    </Layout>
  );
}
