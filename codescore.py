from codebleu import calc_codebleu

pred = """test('should download file within 5 seconds', async () => {
  const startTime = Date.now();
  const file = await downloadFile();
  expect(file).toBeDefined();

  if (Date.now() - startTime > 5000) { // timeout threshold is 5000 ms or 5 seconds
    console.error('Timeout exceeded while waiting for file to download');
  }
});
"""

ref = """async function fetchWithTimeout(fetchFn, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeout)
  );
  return Promise.race([fetchFn(), timeoutPromise]);
}
test("should download file within 5 seconds", async () => {
  const file = await fetchWithTimeout(downloadFile);
  expect(file).toBeDefined();
});
"""

result = calc_codebleu([ref], [pred], lang="javascript", weights=(0.10, 0.10, 0.40, 0.40), tokenizer=None)
print(result)