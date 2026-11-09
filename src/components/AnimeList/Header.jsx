import Link from "next/link"

const Header = ({title, linkHref, linkTitle}) => {
    return (
        <div className="flex justify-between p-4 items-center">
          <h1 className="text-xl font-semibold">{title}</h1>

          {linkHref && linkTitle ?(
            <Link href={linkHref} className="md:text-md text-sm underline hover:text-accent transition-all">{linkTitle}</Link>
        
          ) : null}
        </div>
    )
}

export default Header 