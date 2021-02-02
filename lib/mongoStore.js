
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

export default class MongoStore {
    constructor() {
        this.waitInit = this.init();
    }
    async init() {        
        this.client = new MongoClient(process.env.MONGO_URI);
        await this.client.connect();
        this.db = this.client.db("nextit");
        this.collection = this.db.collection("pull_requests");
    }
    async closePullRequest(pullRequest) {
        await this.waitInit;
        await this.collection.insertOne(pullRequest);
    }
    async getPullRequests() {
        await this.waitInit;
        const cursor = this.collection.find();
        return (await cursor.toArray()).map(({ _id, ...rest }) => rest);
    }

    async getUploadEvidenceStream(id) {
        await this.waitInit;
        const bucket = new GridFSBucket(this.db, { bucketName: 'evidence' });
        return bucket.openUploadStream(id);
    }

    async getDownloadEvidenceStream(id) {
        await this.waitInit;
        const bucket = new GridFSBucket(this.db, { bucketName: 'evidence' });
        const stream = bucket.openDownloadStream(new ObjectId(id));
        return stream;
    }
}
