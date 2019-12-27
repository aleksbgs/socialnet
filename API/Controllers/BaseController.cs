using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BaseController : ControllerBase
  {
    private IMediator _meditor;
    protected IMediator Mediator => _meditor ?? (_meditor = HttpContext.RequestServices.GetService<IMediator>());
  }
}
