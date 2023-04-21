import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Logger from '@ioc:Adonis/Core/Logger';
import Mail from '@ioc:Adonis/Addons/Mail';
import Job from 'App/Models/Job';
import Quotation from 'App/Models/Quotation';
export default class QuotationsController {
  public async sendQuoteByEmail({ params, request, response }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        price: schema.number([rules.required()]),
        comment: schema.string.optional()
      })

      const { id } = params
      const bodyRequest = await request.validate({ schema: validationSchema })
      if (!('price' in bodyRequest || 'comment' in bodyRequest)) return response.status(400).json({ error: 'Error to attempt send quote to a job, you must provide price or comment' })

      const job: Job | null = await Job.find(id)

      if (job === null) return response.status(404).json({ error: `Error to send quotation because of this jobId: ${id}` })

      await Mail.send((message) => {
        message
          .from('maker-lvtp@gmail.com', 'Maker LVT People')
          .to(job.emailAddress)
          .subject('New Quotation')
          .htmlView('emails/quotations', {
            customerName: `${job.firstName} ${job.lastName}`,
            price: bodyRequest.price,
            comments: bodyRequest.comment,
            typeClothing: job.typeClothing,
            description: job.description,
          })
        })
      const quotation = new Quotation()
      quotation.jobId = job.id
      quotation.quotations = (quotation.quotations > 0 ) ? quotation.quotations + 1 : 1
      quotation.price = bodyRequest.price
      quotation.comment = bodyRequest.comment
      await quotation.save()

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: `Email was sent to ${job.emailAddress} successfully!`
      })
    } catch (error) {
      Logger.error({ err: new Error(error.message) }, 'Error to attempt to send quotations to a job by email')
      return response.status(500).json({
        status: 'failed',
        code: 500,
        error
      })
    }
  }
}
