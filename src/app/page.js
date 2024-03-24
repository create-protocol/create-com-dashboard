import Link from 'next/link';
import HomePage from '@/pages/home';
import About from '@/pages/about';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

export default function Home() {
  return (
    <>
      <HomePage />
      <ToastContainer />
    </>
  );
}
