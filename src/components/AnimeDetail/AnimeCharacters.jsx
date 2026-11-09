import Image from "next/image"

const AnimeCharacters = ({ characters }) => {
    if(!characters || characters.edges.length === 0) return null;

    return (
        <div className="mt-10">
            <h2 className="text-lg font-semibold text-text mb-4">Characters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.edges.map(({ role, node, voiceActors}, index) => {
                    const va = voiceActors?.[0];

                    return (
                        <div
                            key={node.id || index}
                            className="flex items-center justify-between bg-slate-900/50 overflow-hidden"
                        >
                            {/*LEFT SIDE */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-16 h-20 shrink-0">
                                    {node.image?.large && (
                                        <Image
                                            src={node.image.large}
                                            alt={node.name.full}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-text">{node.name.full}</h4>
                                    <span className="text-xs text-sub">{role}</span>
                                </div>
                            </div>
                            
                            {/* RIGHT SIDE */}
                            {va && (
                                <div className="flex items-center gap-3 text-right">
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-semibold text-text">{va.name.full}</h4>
                                        <span className="text-xs text-sub">Japanese</span>
                                    </div>
                                    <div className="relative w-16 h-20 shrink-0">
                                        {va.image?.large && (
                                            <Image
                                                src={va.image.large}
                                                alt={va.name.full}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeCharacters