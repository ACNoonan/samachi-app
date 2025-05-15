import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./api-doc";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <html>
      <body>
        <div className='pt-6'>
          <section className='container'>
            <ReactSwagger spec={spec} url='/swagger.json' />
          </section>
        </div>
      </body>
    </html>
  );
}