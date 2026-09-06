export default async function BookPage({ params }) {
  const { bookId } = await params;

  const response = await fetch("http://localhost:3001/books");

  const books = await response.json();

  const book = books.find((book) => {
    return book.id.toString() === bookId;
  });

  return <div>{book?.name}</div>;
}
