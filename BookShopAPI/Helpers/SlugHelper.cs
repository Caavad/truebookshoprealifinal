using System.Globalization;
using System.Text;

namespace BookShopAPI.Helpers;

public static class SlugHelper
{
    public static string Slugify(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (var character in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(character);
            if (category == UnicodeCategory.NonSpacingMark)
                continue;

            if (char.IsLetterOrDigit(character))
            {
                builder.Append(character);
            }
            else if (char.IsWhiteSpace(character) || character is '-' or '_')
            {
                if (builder.Length > 0 && builder[^1] != '-')
                    builder.Append('-');
            }
        }

        return builder.ToString().Trim('-');
    }
}
