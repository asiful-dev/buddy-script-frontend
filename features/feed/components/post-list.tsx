import PostItem from "./post-item";

export default function PostList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostItem key={i} />
      ))}
    </div>
  );
}
