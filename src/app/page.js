import Link from 'next/link';
import HomePage from '@/pages/home';
import About from '@/pages/about';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Prompt from '@/pages/prompt';

export default function Home() {
  return (
    <>
      <Prompt />
      <ToastContainer />
    </>
  );
}
