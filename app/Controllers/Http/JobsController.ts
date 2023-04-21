import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger';
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Job from 'App/Models/Job';
export default class JobsController {

  public async postJobs({ request, response }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        firstName: schema.string({}, [rules.alpha(), rules.required()]),
        lastName: schema.string({}, [rules.alpha(), rules.required()]),
        phoneNumber: schema.number([rules.required()]),
        emailAddress: schema.string({}, [rules.email(), rules.required()]),
        address: schema.string({}, [rules.required()]),
        postcode: schema.string({}, [rules.required()]),
        state: schema.string({}, [rules.required()]),
        typeClothing: schema.string({}, [rules.required()]),
        description: schema.string({}, [rules.required()]),
        budget: schema.string.optional()
      })

      const bodyData: Object = await request.validate({ schema: validationSchema })
      const files = request.files('images', {
        size: '10mb',
        extnames: ['jpg', 'png', 'jpeg', 'gif']
      })
      const job: Job = new Job()
      const images: string[] = []

      for (const field in bodyData) {
        job[field] = bodyData[field];
      }

      for (const file of files) {
        const fileName: string = `${cuid()}.${file.extname}`

        await file.moveToDisk('jobs', {
          name: fileName
        }, 'local')

        images.push(fileName)
      }
      job.images = images.join(',')
      await job.save()
      const imageUrls = await job.imageUrls
      return response.status(201).json({
        status: 'success',
        code: 201,
        data: { ...job.$attributes, imageUrls }
      })
    } catch (error) {
      Logger.error({ err: new Error(error.message) }, 'Error to attempt to save a job')
      return response.status(500).json({
        status: 'failed',
        code: 500,
        error
      })
    }
  }

  public async getJobs({ response }: HttpContextContract) {
    try {
      const jobs = await Job.query().preload('quotations')
      return response.status(200).json({
        status: 'success',
        code: 200,
        data: jobs
      })
    } catch (error) {
      Logger.error({ err: new Error(error.message) }, 'Error to attempt to get jobs')
      return response.status(500).json({
        status: 'failed',
        code: 500,
        error
      })
    }
  }

  public async getJobDetail({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const job: Job | null = await Job.find(id)
      if (job === null) return response.status(404).json({
        status: 'failed',
        code: 404,
        message: `Does not exist any job by this ${id}`
      })
      await job?.load('quotations')
      const imageUrls = await job?.imageUrls
      return response.status(200).json({
        status: 'success',
        code: 200,
        data: { ...job.serializeAttributes(), ...job.serializeRelations(), imageUrls }
      })
    } catch (error) {
      Logger.error({ err: new Error(error.message) }, 'Error to attempt to get a job')
      return response.status(500).json({
        status: 'failed',
        code: 500,
        error
      })
    }
  }

  public async getFilterJob({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs()
      const query = Job.query()
      if (!('location' in queryParams || 'typeClothing' in queryParams)) return response.status(400).json({
        status: 'failed',
        code: 400,
        message: 'you must provide location or typeClothing query'
      })
      if (queryParams.location) {
        query.where('state', queryParams.location)
      }
      if (queryParams.typeClothing) {
        query.where('type_clothing', queryParams.typeClothing)
      }
      const jobs = await query.preload('quotations').exec()
      return response.status(200).json({
        status: 'success',
        code: 200,
        data: jobs
      })
    } catch (error) {
      Logger.error({ err: new Error(error.message) }, 'Error to attempt to filter a job')
      return response.status(500).json({
        status: 'failed',
        code: 500,
        error
      })
    }
  }

}
