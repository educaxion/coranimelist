import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-dark">
            <div className="flex flex-row whitespace-nowrap items-center justify-between px-8">
                <div className="flex md:flex-row justify-between items-center p-4 gap-2">
                    <Link href="/" className="font-bold text-accent text-lg sm:text-3xl whitespace-nowrap px-1" style={{ fontFamily: 'modern-tokyo' }} >C o r a n i m e L i s t</Link>
                </div>

                <div className="text-xs text-text">
                    <p>&copy; {new Date().getFullYear()} CoranimeList. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer