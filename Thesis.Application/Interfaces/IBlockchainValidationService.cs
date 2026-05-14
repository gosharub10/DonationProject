namespace Thesis.Application.Interfaces;

public interface IBlockchainValidationService
{
    bool IsValidFormat(string address);
    bool IsChecksumValid(string address);
    Task<bool> IsDuplicateAsync(string address, CancellationToken ct = default);
}
