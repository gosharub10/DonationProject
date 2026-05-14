using Thesis.Application.Common;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Finance.SetProjectWallet;

public sealed class SetProjectWalletCommandHandler : ICommandHandler<SetProjectWalletCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IBlockchainValidationService _validationService;

    public SetProjectWalletCommandHandler(IProjectRepository projectRepository, IBlockchainValidationService validationService)
    {
        _projectRepository = projectRepository;
        _validationService = validationService;
    }

    public async Task<Unit> HandleAsync(SetProjectWalletCommand command, CancellationToken ct)
    {
        if (!_validationService.IsValidFormat(command.WalletAddress))
            throw new ApplicationException("Invalid wallet address format");

        if (!_validationService.IsChecksumValid(command.WalletAddress))
            throw new ApplicationException("Invalid wallet checksum");

        if (await _validationService.IsDuplicateAsync(command.WalletAddress, ct))
            throw new ApplicationException("Wallet address already used by another project");

        var project = await _projectRepository.GetByIdAsync(command.ProjectId, ct);
        if (project is null) throw new ArgumentNullException(nameof(project));

        project.SetWalletAddress(command.WalletAddress);
        await _projectRepository.UpdateAsync(project, ct);

        return new Unit();
    }
}
