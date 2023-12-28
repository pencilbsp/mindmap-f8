import { ArrowRightIcon } from "@radix-ui/react-icons"

import { SITE_NAME } from "@/configs"
import LoginButton from "./LoginButton"
import { Button } from "@/components/ui/button"
import GoogleIcon from "@/components/icons/GoogleIcon"


export default function Login() {
  return (
    <main className="container py-6 flex flex-col items-center justify-center flex-grow">
      <h1 className="font-bold text-center text-3xl">{`Đăng nhập vào ${SITE_NAME}`}</h1>
      <div className="flex flex-col mt-10 max-w-xs w-full gap-3">
        <LoginButton providerName="google">
          <GoogleIcon className="w-6 h-6 mr-2" />
          <span>Tiếp tục với Google</span>
        </LoginButton>
        <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-800 mt-2" />
        <Button variant="link" className="font-light text-base text-violet-500">
          Tiếp tục bằng email
          <ArrowRightIcon className="ml-1 h-5 w-5" />
        </Button>
      </div>
    </main>
  )
}
