export default function DoubleProductShowcase ({
  img1,
  img2,
  id,
  name,
  tag,
  description,
  price
}) {
  return (
    <section className='showcase'>
      {/* Images */}
      <div className='imageWrapper double'>
        <img src={img1} alt={`${id}-1`} width={300} height={400} />
        <img src={img2} alt={`${id}-2`} width={300} height={400} />
      </div>

      {/* Details */}
      <div className='details'>
        <p>
          <strong>{name}</strong> · {tag}
        </p>
        <p>{description}</p>
        <p>{price}</p>
      </div>
    </section>
  )
}
