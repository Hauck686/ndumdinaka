export default function SingleProductShowcase ({
  src,
  id,
  name,
  tag,
  description,
  price
}) {
  return (
    <section className='showcase'>
      {/* Image + floating details */}
      <div className='imageWrapper'>
        <img src={src} alt={id} />

        {/* Floating Product Details */}
        <div className='details'>
          <p>
            <strong>{name}</strong> ·{tag}
          </p>
          <p>{description}</p>
          <p>{price}</p>
        </div>
      </div>
    </section>
  )
}
