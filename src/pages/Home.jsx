import Button from "../components/ui/Button";

function Home() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-between overflow-hidden w-full h-full min-h-screen">
        <img
          src="Logo.png"
          alt="Logo image"
          className="w-12 top-4 left-4 absolute"
        />

        {/** centered section */}
        <div className="flex flex-col items-center justify-center grow space-y-6 text-center px-4">
          <img
            className="w-[20vh] max-h-xs"
            src="home-photo.png"
            alt="Home photo"
          />
          <h1 className="font-quicksand text-dark text-4xl font-bold">
            TaskFlow
          </h1>
          <h3 className="font-quicksand text-dark text-[1.7vh] max-sm:text-base">
            "Organize your task, keep your flow"
          </h3>
          <Button text="Get Started" variant="primary" onClick={() => alert("Get Started clicked")} />
        </div>

        <h3 className="font-quicksand text-dark font-light mb-4">
          © Copyright 2026 Taskflow
        </h3>
      </div>
    </>
  );
}

export default Home;
