export default function Login() {
  return (
    <div className="p-6 max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-700">Login to Finsage</h1>
      <form className="flex flex-col gap-4">
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
      </form>
    </div>
  );
}
