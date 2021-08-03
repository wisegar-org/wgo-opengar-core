import IssueService from '../../src/server/services/IssueService';

describe('Test CurrencyFurterService', () => {
  test('Getting Currency list', async (done) => {
    const issueService = new IssueService();
    const response = await issueService.sendIssue({
        owner: 'wisegar-org',
        repo: 'wgo-opengar',
        title: 'Test',
        body: 'Test from IssueService'
    });

    expect(response).toBeDefined();
    expect(response.succeeded).toEqual(true);
    done();
  });
});
