import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="dot-bg flex min-h-screen flex-col items-center justify-center bg-[#FFFDF5] px-4 text-center">
      <div className="brutal-card bg-[#FF4D00] p-8 text-white">
        <h1 className="font-display text-4xl uppercase">Game over</h1>
        <p className="mt-2 font-bold uppercase">404 — page not found</p>
        <Link to="/" className="brutal-btn mt-5 inline-block bg-[#FFDC00] px-5 py-2 text-sm uppercase text-black">Insert coin → home</Link>
      </div>
    </div>
  );
}
