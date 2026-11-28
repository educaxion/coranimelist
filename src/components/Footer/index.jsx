import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-dark">
            <div className="flex flex-row whitespace-nowrap items-center justify-between gap-3 px-4 sm:px-8 py-4">
                <Link 
                    href="/" 
                    className="font-bold text-accent text-xs sm:text-3xl whitespace-nowrap shrink-0" 
                    style={{ fontFamily: 'modern-tokyo' }} >C o r a n i m e L i s t</Link>

                <div className="min-w-0 text-[10px] sm:text-xs leading-tight text-right text-text">
                    <p>&copy; {new Date().getFullYear()} CoranimeList. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer