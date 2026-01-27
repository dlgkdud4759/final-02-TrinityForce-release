import Image from "next/image"

export default function SplashScreen () {
  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center">
        <Image
        src="/favicon.ico"
        alt="동네책장 로고"
        width={248}
        height={248}
        className="w-40 h-40 md:w-55 md:h-55"
        />

        <p className="text-sm md:text-base text-brown-accent/70">
          동네 사람들의 책이 모이는 곳
        </p>

      </div>
    </div>
  )
}