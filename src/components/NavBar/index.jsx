import Link from "next/link"
import Image from "next/image"
import InputSearch from "./InputSearch"

const Navbar = () => {
    return (
        <header className="bg-primary">
            <div className="flex md:flex-row justify-between items-center p-4 gap-2">
                <Link href="/" className="font-bold text-accent text-lg sm:text-3xl whitespace-nowrap px-1" style={{ fontFamily: 'modern-tokyo' }} >C o r a n i m e L i s t</Link>
                <InputSearch/>
            </div>
        </header>
    )
}

export default Navbar