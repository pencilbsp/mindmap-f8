import { randomUUID } from "crypto"

import { encryptData } from "@/lib/aes"
import getRedisClient from "@/lib/redis"
import HomeHero from "@/components/HomeHero"
import { LightningBoltIcon, CodeIcon, MagicWandIcon } from "@radix-ui/react-icons"

export default async function Home() {
  const id = randomUUID()
  const redisClient = await getRedisClient()
  const tryToken = encryptData({ id, time: Date.now() })
  await redisClient.set(id, tryToken, { EX: 60 * 60 * 60 })

  return (
    <main className="w-full overflow-hidden">
      <HomeHero id={id} tryToken={encodeURIComponent(tryToken)} />

      <section className="relative overflow-hidden min-h-[380px]">
        <div className="flex absolute -top-[400px] left-1/2 [transform:translate3d(-50%,0,0)]">
          <div className="w-[540px] h-[480px] bg-gradient-to-r opacity-20 from-purple-500 to-pink-500 blur-3xl bg [transform:translate3d(120px,0,0)]" />
          <div className="w-[540px] h-[480px] bg-gradient-to-r opacity-20 from-purple-500 to-pink-500 blur-3xl bg [transform:translate3d(-120px,0,0)]" />
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 container pt-24 gap-8 xl:gap-14">
          <li className="flex flex-col gap-y-3 items-start">
            <div className="p-2 border rounded-md text-stone-600 bg-background">
              <LightningBoltIcon className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-2xl">Nhanh chóng</h3>
            <p className=" text-zinc-500">Tạo sơ đồ tư duy bằng một vài cú nhấp chuột hoặc phím tắt keyboard.</p>
          </li>
          <li className="flex flex-col gap-y-3 items-start">
            <div className="p-2 border rounded-md text-stone-600 bg-background">
              <CodeIcon className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-2xl">Không giới hạn</h3>
            <p className=" text-zinc-500">
              Nội dung bạn tạo ra là điều quan trọng nhất, nên chúng tôi đặt nó là trọng tâm của thiết kế giao diện. Sẽ
              không có thanh công cụ hay biểu tượng thừa, làm rối trải nghiệm của bạn.
            </p>
          </li>
          <li className="flex flex-col gap-y-3 items-start">
            <div className="p-2 border rounded-md text-stone-600 bg-background">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-2xl">Đơn giản</h3>
            <p className=" text-zinc-500">
              Để đơn giản hoá trải nghiệm vẽ bản đồ tư duy, chúng tôi đã lược bỏ nhiều chức năng không cần thiết. Kết
              quả là một giao diện tối giản, chỉ còn những tính năng tối trọng.
            </p>
          </li>
        </ul>
      </section>
    </main>
  )
}
