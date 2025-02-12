export default function GradientLine({className}: {className?: string}) {
    return (
        <div className={className + " h-[1px] max-w-full bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent "}></div>
    );
}
