import IssueService from '../../src/server/services/IssueService';

describe('Test IssueService', () => {
  test('Creating Issue', async (done) => {
    const issueService = new IssueService();
    // const response = await issueService.sendIssue({
    //     owner: 'wisegar-org',
    //     repo: 'wgo-opengar-core',
    //     title: 'Test',
    //     body: 'Test from IssueService'
    // });
    // expect(response).toBeDefined();
    // expect(response.succeeded).toEqual(true);
    done();
  });
});
