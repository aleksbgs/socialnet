using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistance;

namespace Application.Activities
{
  public class List
  {
    public class Query : IRequest<List<ActivityDto>> { }

    public class Handler : IRequestHandler<Query, List<ActivityDto>>
    {
      private readonly DataContext _context;
      private readonly ILogger<List> _logger;
      private readonly IMapper _mapper;

      public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
      {
        _context = context;
        _logger = logger;
        _mapper = mapper;
      }

      public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
      {

        var activities = await _context.Activities.ToListAsync();

        return _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
      }
    }

  }
}
