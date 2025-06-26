export default function Signup() {
  return (
    <div className="p-6 max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center text-green-700">Create Your Finsage Account</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Name" className="p-2 border rounded" />
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Sign Up</button>
      </form>
    </div>
  );
}
