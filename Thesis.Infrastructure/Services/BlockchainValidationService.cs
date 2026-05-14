using Nethereum.Util;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Infrastructure.Services;

public class BlockchainValidationService : IBlockchainValidationService
{
    private readonly IProjectRepository _projectRepository;

    public BlockchainValidationService(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public bool IsValidFormat(string address)
    {
        if (string.IsNullOrWhiteSpace(address)) return false;
        return address.StartsWith("0x") && address.Length == 42;
    }

    public bool IsChecksumValid(string address)
    {
        try
        {
            var util = new AddressUtil();
            return util.IsChecksumAddress(address);
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IsDuplicateAsync(string address, CancellationToken ct = default)
    {
        var projects = await _projectRepository.GetAllAsync(ct);
        return projects.Any(p => string.Equals(p.WalletAddress, address, StringComparison.OrdinalIgnoreCase));
    }
}
