import Image from "next/image";
import Link from "next/link";
import iFB from "/public/ico-facebook.svg";
import iIG from "/public/ico-instagram.svg";
import iLK from "/public/ico-linkedin.svg";

export default function Footer() {
  return (
    <footer className="footer"> {/* Usando a classe global */}
      <nav className="socialIcons"> {/* Usando a classe global */}
        <Link
          href="https://www.facebook.com/moovine"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={iFB} alt="Facebook" />
        </Link>
        <Link
          href="https://www.instagram.com/_moovine"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={iIG} alt="Instagram" />
        </Link>
        <Link
          href="https://www.linkedin.com/company/moovine"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={iLK} alt="LinkedIn" />
        </Link>
      </nav>
    </footer>
  );
}