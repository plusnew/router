const PATH_DELIMITER = '/';

export default function formatPath(path: string) {
  let result = path;

  if (result[0] !== PATH_DELIMITER) {
    result = PATH_DELIMITER + result;
  }

  if (result[result.length - 1] !== PATH_DELIMITER) {
    result = result + PATH_DELIMITER;
  }

  return result;
}
