import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="px-8 max-w-screen-2xl mx-auto mb-20 pt-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-on-primary h-[600px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-90 z-10"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7zWLtpaaONLrOxQbSBU2qh-pTv935E4pAVAGBU3m3A5fSOfqmOeJ_SH2fBQsUFM5w_ykGA_vWM-RzD48Wk95DTmphv8740Ai1zZZh8FJ8uRAMuCTVodYXlwbBfR2pJfvUKZRn-VweMO6-W_d9N1CEVBwpoIg0E7_D2eczgVQZOPkgJoh1kIlR27pphrZ1HOeziPCzWuki_RJvyvU8eOG4d67Eg5W2q7LNQA0w4b5zUWWzPxtna3ogThw88_-BbnyZoAKQMlT2GlU"
            alt="Library"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 px-16 lg:px-24 max-w-4xl">
            <h4 className="font-label uppercase tracking-[0.2em] text-on-primary-container mb-6 text-sm font-semibold">
              Exclusively Selected
            </h4>
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Curated for the Inquisitive Mind
            </h1>
            <p className="font-body text-xl text-on-primary/80 max-w-lg mb-10 leading-relaxed">
              Discover a world where every volume is a masterpiece. We bring you a digital archive of literature, science, and history for the modern intellectual.
            </p>
            <div className="flex gap-4">
              <Link to="/explore" className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl inline-block">
                Bắt đầu khám phá
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all">
                Bộ sưu tập
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="px-8 max-w-screen-2xl mx-auto mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-5xl font-black text-primary tracking-tighter">Danh mục tuyển chọn</h2>
            <p className="text-outline mt-2 text-lg">Khám phá các lĩnh vực tri thức tinh hoa.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[600px]">
          <Link to="/explore?category=Fiction" className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer block">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzVeCeoneS95w1y7jHbGGEJCzbqWCcS1qzBhqpYBn5idFxMfqzA35ozgnqdl6nXa7hwZ-fz_ixsq63A3eC_rFx5wrhdI80nDOWfp_BCabRdpYq4DTW8L8u3dkQXcu3MRcnW9AnrSJlDcoHyw72q0MkIArDSRGOY8HaBR8oMzZhFO2jhJhG9Sgveu0QS9PTIslhHeCunPxXR7YIx9us6pf2hNfRUDc-6QgfgYMIg-IaAa9sGhtlGEoeEzE7Clyr9OsdBP1omoyN7bk"
              alt="Fiction"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="font-label text-xs uppercase tracking-widest text-on-primary-container mb-2 block">01</span>
              <h3 className="font-serif text-4xl font-bold text-white mb-2">Fiction</h3>
              <p className="text-white/70 max-w-xs">Những câu chuyện kinh điển vượt thời gian, định hình văn học thế giới.</p>
            </div>
          </Link>
          <Link to="/explore?category=Science" className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer block">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbk71PJZgMedhD63Ml11OfyIkYCyAmCbMQ61JososGNnMkMrcqSFeLcHm-EniYn5BM2N6eqlht17SihfPq25DooCwvLqaVE_I4Gm3SMTpslTo_krydbE-s-m-sKn7WepEyMxsEuU3tPLLuQYzUOJmYwBZ6YoxUO_s5_NBQhkhwQESuI_hptDBd7rCNuNJbKdQDxdeL8qxqLQjjhVkGYH2dEYwnZuBkpS82JPOccVnIdbfh8wyECFDDwuG-Z144-mz69s8QepfaGpk"
              alt="Science"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="font-label text-xs uppercase tracking-widest text-on-primary-container mb-2 block">02</span>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Science</h3>
            </div>
          </Link>
          <Link to="/explore?category=History" className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer block">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTBcrqQfldBlS1Qbgmx7mg_3d5pygMmM8ZBAN2twx9PaFt6XupAIhOMRNXCKxhWdkJ07wQCZWKvNvxNUY7reYVVRHhSnxnJoOae8EAFamSqAg4Mt15kxNMocYOq4JzI7utdfx3CYPjgsRbUCw5_Zbv3aJTmcJg_g1n-l89zWNxAoeJ42Pcz48nhAu0papsNlu3idgexGqnQA8iHOvxlgDWC505qzqaoxil0Iw2w-Ft9e1yBq4XedNEvT6tUehFsXr2vMNdHgVTqZk"
              alt="History"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="font-label text-xs uppercase tracking-widest text-on-primary-container mb-2 block">03</span>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">History</h3>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
