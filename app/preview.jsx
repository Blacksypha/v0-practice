export default async function IndexPage({ searchParams }) {
    const { canceled } = await searchParams
  
    if (canceled) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      )
    }
    return (
      <form action="/api/checkout" method="POST">
        <section>
          <button type="submit" role="link">
            Checkout
          </button>
        </section>
      </form>
    )
  }