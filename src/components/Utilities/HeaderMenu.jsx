import Head from "next/head"

const HeaderMenu = ({ title }) => {
    return (
        <div className="p-4">
            <h3 className="text-center text-2xl font-bold text-text tracking-wider py-4">
                {title}
            </h3>
        </div>
    )
}

export default HeaderMenu