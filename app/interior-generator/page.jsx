import ImageGenerator from "../_components/ImageGenerator";

export default function InteriorGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">AI Interior Designer</h1>
      <p className="mb-8 text-gray-600">
        Transform your space with AI-generated interior designs. Simply describe the room you want, enter its dimensions, and our AI will create a beautiful visualization for you.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg">
        <ImageGenerator />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Tips for great results:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Be specific about the room type (living room, bedroom, kitchen, etc.)</li>
          <li>Mention the style you prefer (modern, rustic, minimalist, etc.)</li>
          <li>Include color preferences if you have any</li>
          <li>Specify key furniture items you want to see</li>
          <li>Add details about lighting or time of day</li>
          <li>Enter accurate room dimensions for properly scaled furniture and layout</li>
        </ul>
      </div>

      <div className="mt-10 p-4 bg-[#C5A790]/10 rounded-lg">
        <h3 className="font-medium mb-2">Example prompt:</h3>
        <p className="italic">
          &quot;A sunny modern minimalist living room with white walls, wooden floors, a gray L-shaped sofa, and large windows. Include indoor plants and a coffee table.&quot;
        </p>
      </div>
    </div>
  );
} 