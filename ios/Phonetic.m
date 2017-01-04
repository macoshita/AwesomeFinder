#import <Foundation/Foundation.h>
#import "Phonetic.h"

@implementation Phonetic

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(get:(NSString *)inputText
             resolver:(RCTPromiseResolveBlock)resolve
             rejecter:(RCTPromiseRejectBlock)reject)
{
  // Thanks: https://github.com/murakami/workbook/tree/master/mac/Ruby

  NSMutableString *outputText = [[NSMutableString alloc] init];

  CFRange range = CFRangeMake(0, [inputText length]);
  CFLocaleRef locale = CFLocaleCopyCurrent();

  /* トークナイザーを作成 */
  CFStringTokenizerRef    tokenizer = CFStringTokenizerCreate(kCFAllocatorDefault,
      (CFStringRef)inputText,
      range,
      kCFStringTokenizerUnitWordBoundary,
      locale);

  /* 最初の位置に */
  CFStringTokenizerTokenType  tokenType = CFStringTokenizerGoToTokenAtIndex(tokenizer, 0);

  /* 形態素解析 */
  while (tokenType != kCFStringTokenizerTokenNone) {
    range = CFStringTokenizerGetCurrentTokenRange(tokenizer);

    /* ローマ字を得る */
    CFTypeRef   latin = CFStringTokenizerCopyCurrentTokenAttribute(tokenizer,
        kCFStringTokenizerAttributeLatinTranscription);
    NSString    *romaji = (__bridge NSString *)latin;

    /* 平仮名に変換 */
    NSMutableString *furigana = [romaji mutableCopy];
    CFStringTransform((CFMutableStringRef)furigana, NULL, kCFStringTransformLatinHiragana, false);

    [outputText appendString:furigana];

    CFRelease(latin);
    tokenType = CFStringTokenizerAdvanceToNextToken(tokenizer);
  }
  CFRelease(tokenizer);

  CFRelease(locale);

  NSMutableString *removeSimbol = outputText.mutableCopy;
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern: @"[^ぁ-ん]"
                                                                         options: 0
                                                                           error: nil];
  [regex replaceMatchesInString: removeSimbol
                        options: 0
                          range: NSMakeRange(0, removeSimbol.length)
                   withTemplate: @""];

  resolve(removeSimbol);
}

@end
