import { Transition } from "@headlessui/react";

import { CubeIcon } from "~/components/icons/CubeIcon";

export function SplashScreen() {
  return (
    <div className="absolute bg-lego-yellow w-full h-screen flex flex-col items-center justify-center">
      <Transition
        show
        appear
        className="flex flex-col items-center justify-center"
        enter="transition-opacity delay-50 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <CubeIcon className="h-36 w-36 text-lego-navy mb-2" />
        <h1 className="text-2xl font-bold text-lego-navy">Brick Manager</h1>
        <p className="text-lego-navy text-opacity-60">made by benyap</p>
      </Transition>
    </div>
  );
}
