export class HelperFunc {

  static TryParseInt(str: any) {
    let retValue = null;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  }

}
