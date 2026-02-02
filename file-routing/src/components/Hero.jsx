import Image from "next/image";

const Hero = () => {
    return (
        <div className="relative w-full h-screen">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/hero.jpeg"
                    alt="mountains"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradiant-to-r from-slate-900"></div>
            </div>
            <div className="flex items-center justify-center p-60">
                <h1 className="font-bold text-4xl text-black
                ">Mountains are hear!</h1>
            </div>
        </div>
    );
};

export default Hero;
