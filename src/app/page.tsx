import GPXLoader from "@/components/GPXLoader";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>Harley Davidson Trip Summary</header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <GPXLoader />
      </main>
      <footer></footer>
    </div>
  );
}
