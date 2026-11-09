"use client"

const Pagination = ({ page, lastPage, setPage}) => {
    const scrollTop = () => {
        scrollTo({
            behavior: "smooth",
            top: 0
        })
    }

    const handleNext = () => {
        setPage((prev) => prev + 1)
        scrollTop()
        }

    const handlePrev = () => {
        setPage((prev) => prev - 1)
        scrollTop()
        }

    return (
        <div className="flex justify-center items-center gap-8 py-16 px-4 text font-semibold">
            {page <= 1 ? null :
                <button onClick={handlePrev} className="transition-all hover:text-accent">
                    Prev
                </button>
            }
            <p>{page} of {lastPage}</p>

            {page >= lastPage ? null :
                <button onClick={handleNext} className="transition-all hover:text-accent">
                    Next
                </button>
            }
        </div>
    )
}

export default Pagination